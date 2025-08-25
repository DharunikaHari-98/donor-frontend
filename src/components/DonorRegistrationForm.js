import React, { useState } from 'react';
import http from '../services/http';

const DonorRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    organType: '',        // kept for UI; not sent to backend (backend doesn't need it)
    contactNumber: '',
    email: '',
    address: '',
    lastDonationDate: ''  // not used by backend; kept for UI
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    const ageNum = parseInt(String(formData.age), 10);
    if (isNaN(ageNum) || ageNum < 18) newErrors.age = 'Donor must be at least 18';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Must be a valid email address';
    if (!formData.gender) newErrors.gender = 'Please select a gender';
    if (!formData.organType) newErrors.organType = 'Please select an organ type';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!validate()) return;

    // Backend expects DonorProfileRequest:
    // { name, phone, email, dob, gender, bloodGroup, address, city, state, medicalNotes, willingPosthumous, willingBlood }
    const payload = {
      name: formData.name.trim(),
      phone: formData.contactNumber || '',
      email: formData.email.trim(),
      // You don't collect DOB/bloodGroup/city/state yet; send sane defaults to unblock integration.
      dob: '1990-01-01',         // TODO: add DOB field in UI later
      gender: formData.gender,
      bloodGroup: 'A+',          // TODO: add Blood Group select in UI later
      address: formData.address || '',
      city: 'Chennai',           // TODO: add City select in UI later
      state: 'TN',               // TODO: add State select in UI later
      medicalNotes: '',
      willingPosthumous: true,
      willingBlood: true
    };

    try {
      await http.post('/api/donor-profiles', payload);
      setMessage('Registration successful!');
      // clear form (optional)
      setFormData({
        name: '', age: '', gender: '', organType: '',
        contactNumber: '', email: '', address: '', lastDonationDate: ''
      });
    } catch (error) {
      const errMsg = error?.response?.data?.message || 'Registration failed';
      setMessage(errMsg);
    }
  };

  return (
    <div>
      <h2>Register as Organ Donor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" data-testid="name-input" placeholder="Name"
               value={formData.name} onChange={handleChange} onBlur={validate} />
        {errors.name && <p>{errors.name}</p>}

        <input type="number" name="age" data-testid="age-input" placeholder="Age"
               value={formData.age} onChange={handleChange} onBlur={validate} />
        {errors.age && <p>{errors.age}</p>}

        <select name="gender" data-testid="gender-select"
                value={formData.gender} onChange={handleChange} onBlur={validate}>
          <option value="">Select Gender</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
          <option value="OTHER">Other</option>
        </select>
        {errors.gender && <p>{errors.gender}</p>}

        {/* Kept for your UI, not used by backend */}
        <select name="organType" data-testid="organtype-select"
                value={formData.organType} onChange={handleChange} onBlur={validate}>
          <option value="">Select Organ Type</option>
          <option value="KIDNEY">Kidney</option>
          <option value="LIVER">Liver</option>
          <option value="HEART">Heart</option>
          <option value="LUNG">Lung</option>
          <option value="PANCREAS">Pancreas</option>
          <option value="CORNEA">Cornea</option>
        </select>
        {errors.organType && <p>{errors.organType}</p>}

        <input type="text" name="contactNumber" data-testid="contact-input" placeholder="Contact Number"
               value={formData.contactNumber} onChange={handleChange} />
        <input type="email" name="email" data-testid="email-input" placeholder="Email"
               value={formData.email} onChange={handleChange} onBlur={validate} />
        {errors.email && <p>{errors.email}</p>}

        <input type="text" name="address" data-testid="address-input" placeholder="Address"
               value={formData.address} onChange={handleChange} />
        <input type="date" name="lastDonationDate" data-testid="lastdonation-input"
               value={formData.lastDonationDate} onChange={handleChange} />

        <button type="submit" data-testid="submit-button">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default DonorRegistrationForm;
