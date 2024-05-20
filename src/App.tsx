import { useState } from "react";
import { Button } from "./components";

export const App = () => {
  const [count, setCount] = useState(0);

  return <Button onClick={() => setCount((c) => c + 1)}>Click Me {count}</Button>;
};
