import '../styles/globals.css'
//added to complete set-up of amplify project
import awsExports from "../src/aws-exports";

Amplify.configure({...awsExports, ssr: true });
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
