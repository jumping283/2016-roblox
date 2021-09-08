import '../styles/globals.css';
import '../styles/helpers/textHelpers.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// Roblox CSS
import '../styles/roblox/icons.css';
import Navbar from '../components/navbar';
import React from 'react';
import Head from 'next/head';
import Footer from '../components/footer';
import dayjs from '../lib/dayjs';
import LoginModalStore from '../stores/loginModal';
import AuthenticationStore from '../stores/authentication';
import NavigationStore from '../stores/navigation';

// @ts-ignore
if (process.browser) {
  console.log(String.raw`
      _______      _________      _____       ______     _
     / _____ \    |____ ____|    / ___ \     | ____ \   | |
    / /     \_\       | |       / /   \ \    | |   \ \  | |
    | |               | |      / /     \ \   | |   | |  | |
    \ \______         | |      | |     | |   | |___/ /  | |
     \______ \        | |      | |     | |   |  ____/   | |
            \ \       | |      | |     | |   | |        | |
     _      | |       | |      \ \     / /   | |        |_|
    \ \_____/ /       | |       \ \___/ /    | |         _
     \_______/        |_|        \_____/     |_|        |_|

     Keep your account safe! Do not paste any text here.

     If someone is asking you to paste text here then you're
     giving someone access to your account, your gear, and
     your ROBUX.

     To learn more about keeping your account safe you can go to

     https://en.help.roblox.com/hc/en-us/articles/203313380-Account-Security-Theft-Keeping-your-Account-Safe-`);
}

function RobloxApp({ Component, pageProps }) {
  return <div>
    <Head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin={''} />
      <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700;1,900&amp;display=swap" rel="stylesheet" />
      <title>{pageProps.title || 'ROBLOX'}</title>
      <link rel='icon' type="image/vnd.microsoft.icon" href='/favicon.ico' />
    </Head>
    <AuthenticationStore.Provider>
      <LoginModalStore.Provider>
        <NavigationStore.Provider>
          <Navbar></Navbar>
        </NavigationStore.Provider>
      </LoginModalStore.Provider>
      <Component {...pageProps} />
      <Footer></Footer>
    </AuthenticationStore.Provider>
  </div>
}

export default RobloxApp;
