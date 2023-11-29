import { createContext } from 'react';

export type UserData = {
    loggedIn: boolean,
    username?: string,
    exp?: number,
}

export type ChangeUser = {
    setUser: (user: UserData) => void
}

const userContext = createContext<UserData & ChangeUser>({ loggedIn: false, setUser: (user: UserData) => { } });

export default userContext;