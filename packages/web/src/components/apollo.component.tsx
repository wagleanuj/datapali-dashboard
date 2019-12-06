import { ApolloProviderProps } from "@apollo/react-common/lib/context/ApolloProvider";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import React, { ReactNode } from "react";
import { CONFIG } from "../config";
export type ApProps = {
    authToken?: string;
    children: ReactNode;
} & ApolloProviderProps<any>
export function CustomApolloProvider(props: ApProps) {
    const client = new ApolloClient({
        uri: CONFIG.localServerURL,
        request: (operation) => {
            operation.setContext({
                headers: {
                    authorization: props.authToken || ''
                }
            })
        }
    })
    return (
        <ApolloProvider client={client}>
            {props.children}
        </ApolloProvider>
    )
}