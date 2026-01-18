export const validate = (schema) => async (req, res, next) => {
    try {
        const parseBody = await schema.parseAsync(req.body);
        req.body = parseBody;
        next();
    }
    catch (error) {
        res.status(400).json({ message: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message,
            })) || "Validation failed" });
    }
};
