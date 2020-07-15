import App, {Container} from "next/app";
import Page from "./../components/Page";
import React from "react";
import {ApolloProvider} from "react-apollo";
import withData from "../lib/withData";


class MyApp extends App {
    static async getInitialProps({Component, ctx}) {
        // getInitialProps is a special next lifecycle method and it will run before the initial render
        let pageProps = {};
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
        // this exposes the query to the user
        pageProps.query = ctx.query;
        return {pageProps}
    }

    render() {
        const {Component, apollo, pageProps} = this.props;
        return (
            <Container>
                <ApolloProvider client={apollo}>
                    <Page>
                        <Component {...pageProps} /> {/*component will be the page that is visited*/}
                    </Page>
                </ApolloProvider>
            </Container>
        )
    }
}

export default withData(MyApp);