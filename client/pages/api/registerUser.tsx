export const registerUser = async (data: {
    name: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}) => {
    const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = new Error();
        (error as any).statusCode = response.status;

        const errorData = await response.json();
        (error as any).errors = errorData.errors;
        
        throw error;
    }

    return response.json(); // Vrátí odpověď, pokud byla registrace úspěšná
};
