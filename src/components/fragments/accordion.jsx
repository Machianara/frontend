import { useState } from "react";

// Data accordion
const processData = [
  {
    id: "01",
    title: "System Assessment",
    description:
      "We begin by analyzing your critical machinery and operational goals to identify the right sensor configurations and data points needed for accurate monitoring.",
  },
  {
    id: "02",
    title: "Integration & Connectivity",
    description:
      "Seamlessly connect your existing machine sensors (PLC/SCADA) to Machinara’s cloud platform, or deploy our IoT devices for a quick, plug-and-play setup.",
  },
  {
    id: "03",
    title: "AI Model Calibration",
    description:
      "During this phase, our AI establishes a 'baseline' of normal machine behavior. It learns your equipment's unique vibration and thermal patterns to distinguish healthy operations from anomalies.",
  },
  {
    id: "04",
    title: "Real-time Monitoring",
    description:
      "Machinara goes live, monitoring your assets 24/7. Our algorithms continuously scan for deviations in vibration, temperature, and acoustics to detect early signs of failure.",
  },
  {
    id: "05",
    title: "Alerts & Actionable Reporting",
    description:
      "When an anomaly is detected, the system instantly generates a detailed maintenance ticket and notifies your team via dashboard or email, ensuring no issue goes unnoticed.",
  },
  {
    id: "06",
    title: "Adaptive Learning",
    description:
      "The system gets smarter over time. By incorporating feedback from your maintenance team after repairs, Machinara refines its predictive models to reduce false alarms and increase accuracy",
  },
];

const AccordionItem = ({ item, isOpen, toggleItem }) => {
  const { id, title, description } = item;

  return (
    <div
      onClick={() => toggleItem(id)}
      className={`accordion-item ${
        isOpen ? "accordion-item--open" : "accordion-item--closed"
      }`}
    >
      <div className="accordion-item__header">
        {" "}
        <div className="accordion-item__trigger">
          <h2 className="accordion-item__number">{id}</h2>{" "}
          <h3 className="accordion-item__title">{title}</h3>{" "}
        </div>{" "}
        <div className="accordion-item__icon-wrapper">
          <div className="accordion-icon">
            <div className="accordion-icon__bar"></div>
            <div className="accordion-icon__bar"></div>
          </div>
        </div>
      </div>
      <div className="accordion-item__panel">
        {" "}
        <div className="accordion-item__panel-content">
          <p>{description}</p>{" "}
        </div>{" "}
      </div>
    </div>
  );
};

const WorkingProcess = ({ className }) => {
  const [openItem, setOpenItem] = useState("01");
  const toggleItem = (id) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className={`container-main ${className}`}>
      <div className="accordion-wrapper">
        {processData.map((item) => (
          <AccordionItem
            key={item.id}
            item={item}
            isOpen={openItem === item.id}
            toggleItem={toggleItem}
          />
        ))}{" "}
      </div>{" "}
    </section>
  );
};

export default WorkingProcess;
