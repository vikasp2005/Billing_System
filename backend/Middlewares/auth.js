export const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized', status: 'error' });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.session.userRole === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden', status: 'error' });
    }
};