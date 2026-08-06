import { describe, expect, test } from "vitest";
import {
    type CreateUser,
    type ProfileUpdate,
    toUpdateUser,
    type UpdateUser,
    ZCreateUserSchema,
    ZProfileUpdateSchema,
    ZUpdateUserSchema,
    ZUserRoleSchema,
} from "./user.ts";
import type { User } from "@/models/index.ts";

describe("ZUserRoleSchema", () => {
    test("accepts a valid role", () => {
        const roles = ["user", "admin", "moderator", "superadmin"];
        for (const l of roles) {
            const r = ZUserRoleSchema.safeParse(l);
            expect(r.success).toBe(true);
        }
    });
    test("rejects an invalid role", () => {
        const r = ZUserRoleSchema.safeParse("god");
        expect(r.success).toBe(false);
    });
});

describe("ZCreateUserSchema", () => {
    const user: CreateUser = {
        email: "hell@yeah.com",
        role: "admin",
        username: "ozzy",
        avatarUrl: "https://cdn.example.com/assets/yeah.png",
    };

    test("accepts a valid user", () => {
        const r = ZCreateUserSchema.safeParse(user);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(user);
    });
    
    test("accepts a valid user without optional fields", () => {
        const { avatarUrl: _avatarUrl, ...newUser } = user;
        const r = ZCreateUserSchema.safeParse(newUser);
        expect(r.success).toBe(true);
    });

    test("rejects a user if avatarUrl is not a URL", () => {
        const r = ZCreateUserSchema.safeParse({
            ...user,
            avatarUrl: 'haha oops'
        })
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    })
    
    test("rejects an invalid user", () => {
        const r = ZCreateUserSchema.safeParse({
            email: undefined,
            role: "superadmin",
            username: "evil_ozzy",
        });
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });
});

describe("ZUpdateUserSchema", () => {
    const user: UpdateUser = {
        username: "ozzy",
        avatarUrl: "https://cdn.example.com/assets/yeah.png",
        avatarFile: undefined,
        tagline: "rap and tech support",
        bio: undefined,
    };

    test("accepts a valid user", () => {
        const r = ZUpdateUserSchema.safeParse(user);
        expect(r.success).toBe(true);
        expect(r.data).toEqual(user);
    });

    test("accepts a valid user without optional fields", () => {
        const {
            avatarUrl: _avatarUrl,
            avatarFile: _avatarFile,
            bio: _bio,
            tagline: _tagline,
            ...updateUser
        } = user;
        const r = ZUpdateUserSchema.safeParse(updateUser);
        expect(r.success).toBe(true);
    });

    test("rejects an invalid user", () => {
        const badUser = {
            username: "evil_ozzy",
            avatarUrl: { permissions: "god_mode" },
            tagline: Math.random(),
        };
        const r = ZUpdateUserSchema.safeParse(badUser);
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });

    test("rejects input to protected fields", () => {
        const protectedFields = ["id", "auth0Id", "createdAt", "email", "role"];
        const badUser = {
            id: Math.random(),
            auth0Id: "auth0|1234567890qwertuiop",
            createdAt: new Date(),
            email: "hell@no.com",
            role: "admin",
        };
        const r = ZUpdateUserSchema.safeParse(badUser);
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
        const issueFields = r.error?.issues.flatMap((e) => e.path);
        for (const field of protectedFields) {
            expect(issueFields).toContain(field);
        }
    });
});

describe("ZProfileUpdateSchema", () => {
    const profile: ProfileUpdate = {
        username: "ozzy",
        avatarUrl: "https://cdn.example.com/assets/yeah.png",
        avatarFile: undefined,
        tagline: "rap and tech support",
        bio: undefined,
    };

    const badProfile = {
        username: "evil_ozzy",
        avatarUrl: { permissions: "god_mode" },
        avatarFile: undefined,
        tagline: Math.random(),
        bio: undefined,
    };

    test("accepts a valid user", () => {
        const r = ZProfileUpdateSchema.safeParse(profile);
        expect(r.success).toBe(true);
    });

    test("strips loose fields", () => {
        const r = ZProfileUpdateSchema.safeParse({ ...profile, extra: "thing" });
        expect(r.success).toBe(true);
        expect(r.data).toStrictEqual(profile);
    });

    test("rejects an invalid user", () => {
        const r = ZProfileUpdateSchema.safeParse(badProfile);
        expect(r.success).toBe(false);
        expect(r.error).toBeDefined();
    });
});

describe("toUpdateUser", () => {
    
    const user: User = {
        id: 2,
        username: 'ozzy',
        avatarUrl: "https://cdn.example.com/assets/yeah.png",
        auth0Id: 'auth0|123456iejrpaofj',
        bio: null,
        tagline: null,
        createdAt: new Date().toISOString(),
        email: "me@f.com",
        role: "admin",
    };
    
    test("converts to updateUser", () => {
        const r = toUpdateUser(user);
        expect(r).toStrictEqual({
            username: 'ozzy',
            avatarUrl: "https://cdn.example.com/assets/yeah.png",
            bio: null,
            tagline: null,
        });
    })
})