import { Socket } from "socket.io";

export interface SocketWithCookies extends Socket {
  cookies?: any;
}

const cookieParser = (
  socket: SocketWithCookies,
  next: (err?: Error | undefined) => void
): void => {
  let rawCookies = socket.request.headers.cookie?.split("; ");
  let parsedCookies: any = {};
  rawCookies?.forEach((cookie) => {
    let cookieSplitted = cookie.split("=");
    parsedCookies[cookieSplitted[0]] = cookieSplitted[1];
  });
  socket.cookies = parsedCookies;
  next();
};

export default cookieParser;
