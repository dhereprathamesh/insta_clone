import { FaEye, FaEyeSlash } from "react-icons/fa";

const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  showPasswordToggle = false,
  isPasswordVisible,
  togglePasswordVisibility,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-white font-medium mb-1">{label}</label>
      <div className="relative">
        <input
          {...register(name, { required: `${label} is required` })}
          name={name}
          type={
            showPasswordToggle
              ? isPasswordVisible
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
        />
        {showPasswordToggle && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white cursor-pointer"
          >
            {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
};

export default TextInput;
