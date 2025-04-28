import React, { useState } from 'react';

const SubmitReport = () => {
  const [form, setForm] = useState({
    crimetype: '',
    location: '',
    message: '',
    severity: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');

    try {
      const res = await fetch('http://localhost:4000/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Report submitted successfully!');
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Submit Crime Report</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="crimetype" placeholder="Crime Type" onChange={handleChange} required /><br />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required /><br />
        <textarea name="message" placeholder="Message" onChange={handleChange} required /><br />
        <select name="severity" onChange={handleChange} required>
          <option value="">Select Severity</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select><br /><br />
        <button type="submit">Submit Report</button>
      </form>
      <p>{status}</p>
    </div>
  );
};

export default SubmitReport;
