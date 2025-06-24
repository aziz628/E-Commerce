const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

function verifyWebSocketClient(info, done) {
  //  Token sent like this: ws://localhost:3000?token=xyz
  const url = new URL(`http://127.0.0.1${info.req.url}`);
  console.log("server pov url  ",info.req.url)
  cookies = info.req.headers.cookie; // Access cookies from the headers
  const token = cookies
            ?.split('; ')
            .find(row => row.startsWith('token='))
            ?.split('=')[1]; // Extract the 'token' value
console.log("token",token,"cookies",info.req.headers.cookie)
  if (!token) return done(false, 401, "Missing token");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    info.req.user = decoded; //  Save user info for later in connection
    done(true); // Accept connection
  } catch (err) {
    done(false, 403, "Invalid token");
  }
}

module.exports = { verifyWebSocketClient };
