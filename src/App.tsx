import { useAuth } from "./features/auth/hooks/use-auth";
import { loginSchema } from "./services";
import { Controller } from "react-hook-form";

export const App = () => {
  const { control, errors, mutation, onSubmit } = useAuth("login", loginSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <input
            onChange={onChange}
            value={value}
            style={{
              border: "1px solid black",
              width: "200px",
              height: "200px",
            }}
          />
        )}
      />
    </form>
  );
};
