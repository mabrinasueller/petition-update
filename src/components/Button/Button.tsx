import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "outline" | "primary" | "accent";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

export function Button({ variant, ...props }: ButtonProps) {
  return (
    <button {...props} className={`${styles.button} ${styles[variant]}`} />
  );
}
