import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import API from '../services/api';

function Home() {
  const { currentUser } = useSelector((state) => state.user);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await API.get('/api/details/getDetails');
        setDetails(response.data.details);
      } catch (error) {
        console.error('Failed to fetch details:', error);
        setError('Unable to fetch details at the moment.');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchDetails();
    }
  }, [currentUser?._id]);

  return (
    <div>
      <Navbar />
      <div className="m-4">
        <h1>Welcome: {currentUser?.name || 'Guest'}</h1>
        <h1>Role: {currentUser?.role || 'N/A'}</h1>
        {loading ? (
          <p>Loading details...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : details.length > 0 ? (
          <>
            <h1>Collection Data Update Date: {details[0]?.updateDate || 'No data available'}</h1>
            <h1>Description: {details[0]?.description || 'No description available'}</h1>
          </>
        ) : (
          <p>No details found.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
