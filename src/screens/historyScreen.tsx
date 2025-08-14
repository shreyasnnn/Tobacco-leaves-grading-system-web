import React, { useEffect, useState } from "react";
import { apiLeaves, LeaveRecord } from "@/services/apiLeaves";

export const HistoryScreen: React.FC = () => {
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await apiLeaves();
        if (error) {
          setError(error);
        } else {
          setData(data ?? []);
        }
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message || JSON.stringify(error)}</p>;

  return (
    <div>
      {data.length > 0 ? (
        data.map((leave, index) => (
          <div key={leave.user_id + index} style={{ marginBottom: "1rem" }}>
            <img src={leave.image_url} alt={`Leave ${leave.result}`} width={200} />
            <p>Name: {leave.result}</p>
            <p>Confidence: {leave.confidence}</p>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default HistoryScreen;
