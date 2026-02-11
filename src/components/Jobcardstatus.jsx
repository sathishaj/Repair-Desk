import { useEffect, useState, useMemo } from "react";
import { AgCharts } from "ag-charts-react";
import {
  BarSeriesModule,
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  ModuleRegistry,
  NumberAxisModule,
} from "ag-charts-community";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../Firebaseconfig";

ModuleRegistry.registerModules([
  BarSeriesModule,
  CategoryAxisModule,
  LegendModule,
  LineSeriesModule,
  NumberAxisModule,
]);



const Jobcardstatus = () => {
  const [jobcardlist, setJobcardlist] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jobcard"), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobcardlist(list);
    });
    return () => unsub();
  }, []);

  const chartData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // 1. Filter for current month only
    const filteredList = jobcardlist.filter((item) => {
      if (!item.createdon) return false;
      
      // Convert Firestore Timestamp to JS Date
      const date = item.createdon.toDate(); 
      return (
        date.getMonth() === currentMonth && 
        date.getFullYear() === currentYear
      );
    });

    // 2. Count statuses for the filtered results
    const counts = filteredList.reduce((acc, curr) => {
      const status = curr.jobcardstatus || "Unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map((key) => ({
      status: key,
      count: counts[key],
    }));
  }, [jobcardlist]);

  const [options, setOptions] = useState({
    title: { text: "Job Card Status (This Month)" },
    data: [],
    series: [{
      type: "bar",
      xKey: "status",
      yKey: "count",
      fill: "#5470c6", // Customizing color to make it pop
    }],
  });

  useEffect(() => {
    setOptions((prev) => ({ ...prev, data: chartData }));
  }, [chartData]);

  return (
    <div className="w-[380px] sm:w-[500px] rounded-lg ">
      <AgCharts options={options} />
    </div>
  );
};

export default Jobcardstatus;