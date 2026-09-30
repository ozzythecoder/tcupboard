import {
    Combobox,
    type ComboboxRootProps,
    Portal,
    useListCollection,
} from "@skeletonlabs/skeleton-react";
import { useDebouncedValue } from "@tanstack/react-pacer";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar } from "#/components/ui/Avatar";
import { useProtectedApiContext } from "#/config/api";
import { useAuth0Context } from "#/config/auth-context";
import { UnauthorizedError } from "#/config/error";
import { userQueries } from "#/features/user/api";
import { useFieldContext } from "#/form/context";

interface Props {
    handleChange: (userId?: string) => void;
}

export function UserSearch({ handleChange }: Props) {

    /*
        This component uses field context to derive "reset" state,
        but is otherwise self-contained. Runs the `handleChange` function
        to propagate state up to the parent context.
        This is probably an anti-pattern, but it works ok here.
    */
    
    const field = useFieldContext<string>();
    const api = useProtectedApiContext().getApi();
    const { user } = useAuth0Context();
    if (!api || !user) throw new UnauthorizedError();

    const [searchUsername, setSearchUsername] = useState("");
    const [debouncedUsername] = useDebouncedValue(searchUsername, { wait: 200 });

    const { data: usersIncludingMe, isFetching } = useQuery({
        ...userQueries.getOneByUsername(debouncedUsername, api),
        enabled: debouncedUsername !== "",
        throwOnError: false,
        staleTime: 10_000,
    });
    const users = usersIncludingMe?.filter((e) => e.id !== user.id);

    useEffect(() => {
        // pseudo-controlled state
        if (!field.state.value) {
            setSearchUsername("");
        }
    }, [field.state.value]);

    const collection = useListCollection({
        items: users ?? [],
        itemToString: (item) => item.username,
        itemToValue: (item) => item.id.toString(),
    });

    const handleInput: ComboboxRootProps["onInputValueChange"] = (e) => {
        const sanitized = e.inputValue.trim().replace(/[\W]+/g, "");
        setSearchUsername(sanitized);
    };

    const handleValueChange: ComboboxRootProps["onValueChange"] = (e) => {
        if (!e.value[0]) {
            handleChange();
        } else {
            handleChange(e.value[0]);
        }
    };

    return (
        <Combobox
            className="flex-grow"
            collection={collection}
            inputBehavior="autohighlight"
            inputValue={searchUsername}
            onInputValueChange={handleInput}
            onValueChange={handleValueChange}
            placeholder="Search..."
        >
            <Combobox.Control>
                <Combobox.Input className="input preset-glass-surface-200-800 border-0 outline-0 focus-visible:ring-1 focus-visible:ring-surface-800-200 drop-shadow-lg" />
                <Combobox.Trigger />
            </Combobox.Control>
            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content className="max-h-80 overflow-y-scroll">
                        {isFetching ? (
                            <Loader className="animate-spin" />
                        ) : users ? (
                            users?.map((item) => (
                                <Combobox.Item item={item} key={item.id}>
                                    <Avatar
                                        avatarUrl={item.avatarUrl}
                                        className="size-8"
                                        user={item.username}
                                    />
                                    <Combobox.ItemText>{item.username}</Combobox.ItemText>
                                </Combobox.Item>
                            ))
                        ) : null}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox>
    );
}
