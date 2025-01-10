import jwt from 'jsonwebtoken';

export const authorize = (roles) => {
    return (req, res, next) => {
        const token = req.headers.authorization?.split(" ")[1];

        // console.log(token)
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No access token" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles && !roles.includes(decoded.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: "Access token expired" });
            }
            return res.status(403).json({ message: "Invalid token" });
        }
    };
};