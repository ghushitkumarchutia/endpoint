import { useState } from "react";

const SchemaEditor = ({ schema, onChange, readOnly }) => {
  const [error, setError] = useState(null);
  const [value, setValue] = useState(
    schema ? JSON.stringify(schema, null, 2) : "",
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (!newValue.trim()) {
      setError(null);
      onChange && onChange(null);
      return;
    }

    try {
      const parsed = JSON.parse(newValue);
      setError(null);
      onChange && onChange(parsed);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className='space-y-2'>
      <textarea
        value={value}
        onChange={handleChange}
        readOnly={readOnly}
        placeholder='{"type": "object", "properties": {...}}'
        className={`w-full h-48 p-3 font-mono text-sm bg-muted border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          error ? "border-red-500" : "border-border"
        } ${readOnly ? "opacity-70 cursor-not-allowed" : ""}`}
      />
      {error && <p className='text-xs text-red-500'>{error}</p>}
    </div>
  );
};

export default SchemaEditor;
