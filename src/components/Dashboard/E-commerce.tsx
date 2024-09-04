"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { getCollectionCount } from "@/services/firebase";
import CardDataStats from "../CardDataStats";

const MapOne = dynamic(() => import("@/components/Maps/MapOne"), {
  ssr: false,
});

const ChartThree = dynamic(() => import("@/components/Charts/ChartThree"), {
  ssr: false,
});

const ECommerce: React.FC = () => {
  const [dataCounts, setDataCounts] = useState({
    wisata: 0,
    pengajuan_wisata: 0,
    feedback: 0,
    users: 0,
  });

  useEffect(() => {
    const fetchDataCounts = async () => {
      try {
        const wisataCount = await getCollectionCount("wisata");
        const pengajuanWisataCount = await getCollectionCount("pengajuan_wisata");
        const feedbackCount = await getCollectionCount("feedback");
        const usersCount = await getCollectionCount("users");

        setDataCounts({
          wisata: wisataCount,
          pengajuan_wisata: pengajuanWisataCount,
          feedback: feedbackCount,
          users: usersCount,
        });
      } catch (error) {
        console.error("Error fetching data counts:", error);
      }
    };

    fetchDataCounts();
  }, []);

  return (
    <>
    {/* Banner Section */}
    <div className="mb-8 p-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg text-center text-white">
    <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">Selamat Datang Admin Explore Simeulue</h2>
    <p className="mt-2 text-lg md:text-xl lg:text-2xl">Kelola data pariwisata Anda dengan mudah dan efisien</p>

      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {/* Existing CardDataStats components */}
        <CardDataStats
          title="Total Wisata"
          total={dataCounts.wisata.toString()}
          rate="0.43%"
          levelUp
        >
          {/* SVG icon for "Total Wisata" */}
          <svg
            className="h-5 w-5 text-cyan-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
            <line x1="8" y1="2" x2="8" y2="18" />
            <line x1="16" y1="6" x2="16" y2="22" />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Pengajuan Wisata"
          total={dataCounts.pengajuan_wisata.toString()}
          rate="4.35%"
          levelUp
        >
          {/* SVG icon for "Total Pengajuan Wisata" */}
          <svg
            className="h-6 w-6 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Feedback"
          total={dataCounts.feedback.toString()}
          rate="2.59%"
          levelUp
        >
          {/* SVG icon for "Total Feedback" */}
          <svg
            className="h-6 w-6 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
            />
          </svg>
        </CardDataStats>
        <CardDataStats
          title="Total Users"
          total={dataCounts.users.toString()}
          rate="0.95%"
          levelDown
        >
          {/* SVG icon for "Total Users" */}
          <svg
            className="h-6 w-6 text-rose-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </CardDataStats>
      </div>
  
      
    </>
  );
}

export default ECommerce;
