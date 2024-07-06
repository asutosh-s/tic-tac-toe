import React, { useState } from "react";
import styles from "@/styles/wordle.module.css";

const FiveCharForm = ({ passValue }: { passValue: (items: string) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [submittedValue, setSubmittedValue] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase(); // Convert to uppercase
        if (/^[A-Z]{0,5}$/.test(value)) { // Validate that the input is uppercase and at most 5 characters long
            setInputValue(value);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        passValue(inputValue);
    };
    // handleSubmit(inputValue);

    return (
        <div className={styles["game-row"]}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    maxLength={5} // Ensure maximum length of 5 characters
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default FiveCharForm;