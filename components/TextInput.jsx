const TextInput = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  ...props
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block font-medium">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full p-2 border rounded"
        {...register(name, { required: `${label} is required` })}
        {...props}
      />
      {errors[name] && (
        <span className="text-red-500">{errors[name].message}</span>
      )}
    </div>
  );
};

export default TextInput;
