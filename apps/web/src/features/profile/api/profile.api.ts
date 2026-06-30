import {} from "@cloudinary/url-gen";
import type { CloudinarySignature, UpdateUser } from "@repo/shared";
import { mutationOptions } from "@tanstack/react-query";
import ky from "ky";
import type { ProtectedApi } from "#/config/api";
import { handleHttpError } from "#/config/error";
import { userKeys } from "../../user/api";

export const profileMutations = {
    edit: (id: number, api: ProtectedApi) =>
        mutationOptions({
            mutationFn: async (profile: UpdateUser) => {
                try {
                    let avatarUrl = profile.avatarUrl;
                    if (profile.avatarFile) {
                        const { apiKey, timestamp, signature, cloudName } = await api
                            .get<CloudinarySignature>("cloudinary-signature?folder=user-avatars")
                            .json();

                        const imgUpload = new FormData();
                        imgUpload.append("file", profile.avatarFile);
                        imgUpload.append("timestamp", String(timestamp));
                        imgUpload.append("signature", signature);
                        imgUpload.append("api_key", apiKey);
                        imgUpload.append("upload_preset", "v2:avatars");

                        const res = await ky
                            .post<{ secure_url: string }>(
                                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                                {
                                    body: imgUpload,
                                    baseUrl: undefined,
                                    prefix: undefined,
                                    credentials: undefined,
                                    headers: {},
                                },
                            )
                            .json();
                        console.log(res);
                        avatarUrl = res.secure_url;
                    }

                    return await api
                        .patch(`users/${id}`, {
                            body: JSON.stringify({
                                ...profile,
                                avatarUrl,
                            }),
                        })
                        .json();
                } catch (e) {
                    throw handleHttpError(e);
                }
            },
            onSuccess: (_d, _v, _r, ctx) => {
                ctx.client.invalidateQueries({ queryKey: userKeys.me });
            },
        }),
};
