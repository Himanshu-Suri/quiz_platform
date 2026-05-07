import {
  useEffect,
  useState,
} from "react";

import { useParams } from "react-router-dom";

import api from "../../api/axios";

import Navbar from "../../components/common/Navbar";

const Leaderboard = () => {
  const { id } =
    useParams();

  const [leaders, setLeaders] =
    useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard =
    async () => {
      try {
        const res =
          await api.get(
            `/quizzes/${id}/leaderboard`
          );

        setLeaders(
          res.data
        );
      } catch (err) {
        console.log(
          err.response?.data
        );
      }
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-4xl font-bold mb-8">
            Leaderboard
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-4 text-left">
                    Rank
                  </th>

                  <th className="p-4 text-left">
                    Student
                  </th>

                  <th className="p-4 text-left">
                    Score
                  </th>

                  <th className="p-4 text-left">
                    Percentage
                  </th>
                </tr>
              </thead>

              <tbody>
                {leaders.map(
                  (
                    leader,
                    index
                  ) => (
                    <tr
                      key={
                        leader._id
                      }
                      className="border-b"
                    >
                      <td className="p-4 font-bold">
                        #
                        {index +
                          1}
                      </td>

                      <td className="p-4">
                        {
                          leader
                            .student
                            ?.name
                        }
                      </td>

                      <td className="p-4">
                        {
                          leader.score
                        }
                      </td>

                      <td className="p-4">
                        {
                          leader.percentage
                        }
                        %
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {leaders.length ===
              0 && (
              <div className="text-center py-10 text-gray-500">
                No attempts yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;