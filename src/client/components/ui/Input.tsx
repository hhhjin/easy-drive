import {
  forwardRef,
  type Ref,
  type ComponentProps,
  type ReactNode,
} from "react";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

import { tw } from "@client/utils/styles";
import Tooltip from "./Tooltip";

interface Props extends ComponentProps<"input"> {
  label?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
  button?: ReactNode;
  help?: ReactNode;
  errorMsg?: ReactNode;
}

const Input = forwardRef(
  (
    { label, left, right, button, help, errorMsg, className, ...props }: Props,
    ref: Ref<HTMLInputElement>
  ) => (
    <>
      {label && (
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <label className="input-group">
        {left && <span>{left}</span>}
        <div className="relative flex-1">
          <input
            ref={ref}
            spellCheck={false}
            autoComplete="off"
            {...props}
            className={tw(
              "input relative w-full rounded-none pr-9",
              errorMsg ? "input-error" : undefined,
              className
            )}
          />
          {help && (
            <div className="absolute top-0 right-0 flex h-full items-center px-3">
              <Tooltip content={help}>
                <QuestionMarkCircledIcon
                  className={tw(errorMsg ? "text-red-500" : "text-gray-500")}
                />
              </Tooltip>
            </div>
          )}
        </div>
        {right && <span>{right}</span>}
        {button}
      </label>
      <div className="mt-1 mb-3 h-6 text-sm text-red-500">{errorMsg}</div>
    </>
  )
);

Input.displayName = "Input";

export default Input;
