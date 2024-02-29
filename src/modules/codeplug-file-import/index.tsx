import * as React from "react";

export default function CodeplugFileImport() {
  
  const handleSubmit = (event) => {
    debugger;
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" accept=".bin,application/octet-stream" />
      <button type="submit">Import RAW Codeplug</button>
    </form>
  );
}
