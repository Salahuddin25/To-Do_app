import { Tab, TabList, ToggleButton } from "@fluentui/react-components";
import React, { useState } from "react";
import {
  Board24Filled,
  Archive24Filled,
  Briefcase24Filled,
  Home24Filled,
  PersonAccounts24Filled,
  Person24Filled,
  Document24Filled,
  TableFreezeRow24Filled,
  ChartPerson24Filled,
  GanttChart24Filled,
  Board24Regular,
  Archive24Regular,
  Briefcase24Regular,
  Home24Regular,
  PersonAccounts24Regular,
  Person24Regular,
  Document24Regular,
  TableFreezeRow24Regular,
  ChartPerson24Regular,
  GanttChart24Regular,
  ChevronDoubleLeft20Filled,
  ChevronDoubleRight20Filled,
  ChevronUp20Filled,
  ChevronDown20Filled,
  Add24Filled,
  Add24Regular,
  bundleIcon,
} from "@fluentui/react-icons";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import logo_img from "../../../assets/img/e-logo.png";
import "../../../assets/styles/sidebar.scss";

const Board = bundleIcon(Board24Filled, Board24Regular);
const Summary = bundleIcon(Archive24Filled, Archive24Regular);
const Briefcase = bundleIcon(Briefcase24Filled, Briefcase24Regular);
const Home = bundleIcon(Home24Filled, Home24Regular);
const PersonAccounts = bundleIcon(
  PersonAccounts24Filled,
  PersonAccounts24Regular
);
const Person = bundleIcon(Person24Filled, Person24Regular);
const Document = bundleIcon(Document24Filled, Document24Regular);
const TableFreezeRow = bundleIcon(
  TableFreezeRow24Filled,
  TableFreezeRow24Regular
);
const ChartPerson = bundleIcon(ChartPerson24Filled, ChartPerson24Regular);
const GanttChart = bundleIcon(GanttChart24Filled, GanttChart24Regular);
const Add = bundleIcon(Add24Filled, Add24Regular);

const tabs = [
  {
    heading: "Organization",
    items: [
      {
        id: "todolist",
        name: "To-do List",
        icon: <TableFreezeRow />,
        path: "/todos",
        subTabs: [
          {
            id: "addtodo",
            name: "Add To-do",
            icon: <Add />,
            path: "/todos/add",
          }
        ]
      },
      { id: "offices", name: "Offices", icon: <Briefcase />, path: "/offices" },
      {
        id: "departments",
        name: "Departments",
        icon: <Home />,
        path: "/departments",
      },
    ],
  },
  {
    heading: "HR",
    items: [
      {
        id: "employees",
        name: "Employees",
        icon: <PersonAccounts />,
        path: "/employees",
      },
      { id: "profile", name: "Profile", icon: <Person />, path: "/profile" },
      { id: "page", name: "Page", icon: <Document />, path: "/page" },
      {
        id: "pageandtable",
        name: "Page and table",
        icon: <ChartPerson />,
        path: "/pageandtable",
      },
      {
        id: "overview",
        name: "Overview",
        icon: <GanttChart />,
        path: "/overview",
        subTabs: [
          {
            id: "summary",
            name: "Summary",
            path: "/overview/summary",
            icon: <Summary />,
          },
          {
            id: "dashboards",
            name: "Dashboards",
            path: "/overview/dashboards",
            icon: <Board />,
          },
        ],
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isBarExpanded, setIsBarExpanded] = useState(true);
  const [expandedTabs, setExpandedTabs] = useState(new Set());
  const location = useLocation();
  const currentPath = location.pathname;

  const toggleBar = () => {
    setIsBarExpanded(!isBarExpanded);
  };

  const handleMainTabClick = (tab) => {
    if (tab.subTabs) {
      toggleTabExpansion(tab.id);
      navigate(tab.path); 
    } else {
      navigate(tab.path);
    }
  };

  const toggleTabExpansion = (tabId) => {
    setExpandedTabs((prevExpandedTabs) => {
      const newExpandedTabs = new Set(prevExpandedTabs);
      if (newExpandedTabs.has(tabId)) {
        newExpandedTabs.delete(tabId);
      } else {
        newExpandedTabs.add(tabId);
      }
      return newExpandedTabs;
    });
  };

  const getSelectedTab = () => {
    let selectedTabId = null;
  
    for (const section of tabs) {
      for (const item of section.items) {
        if (item.subTabs) {
          const subTabMatch = item.subTabs.find(subTab => subTab.path === currentPath);
          if (subTabMatch) {
            return subTabMatch.id;
          }
        }
        if (item.path === currentPath) {
          selectedTabId = item.id;
        }
      }
    }
  
    return selectedTabId;
  };

  const selectedTab = getSelectedTab();

  const sidebarClass = isBarExpanded ? "sidebar-expanded" : "sidebar-collapsed";

  return (
    <>
        {isBarExpanded ? (
          <div className="logo-side">
          <Link to={"https://ensarsolutions.com/"} target="blank">
            <img
              src="https://ensarsolutions.com/images/ensar/logo.svg"
              alt="Logo" 
            />
            </Link>
          </div>
        ) : (
          <div className="collapse_img">
            <img src={logo_img} alt="To-do list"></img>
          </div>
        )}
      <div className="bar">
      <div className={`sidebar ${sidebarClass}`}>
        <TabList
          vertical
          appearance="subtle"
          selectedValue={selectedTab}
          size="large"
        >
          {tabs.map((section) => (
            <div key={section.heading} className="tabs">
              {isBarExpanded && <h3>{section.heading}</h3>}
              {section.items.map((tab) => (
                <div key={tab.id}>
                  <Tab
                    value={tab.id}
                    icon={tab.icon}
                    onClick={() => handleMainTabClick(tab)}
                  >
                    <div className="tab-content">
                      {isBarExpanded ? (
                        <div className="tab-text">{tab.name}</div>
                      ) : null}
                      <div className="chevron">
                        {tab.subTabs &&
                          isBarExpanded &&
                          (expandedTabs.has(tab.id) ? (
                            <ChevronUp20Filled />
                          ) : (
                            <ChevronDown20Filled />
                          ))}
                      </div>
                    </div>
                  </Tab>
                  {tab.subTabs &&  expandedTabs.has(tab.id)  && (
                    <div className="subtabs">
                      {tab.subTabs.map((subTab) => (
                        <Tab
                          key={subTab.id}
                          value={subTab.id}
                          icon={<span>{subTab.icon}</span>}
                          onClick={() => navigate(subTab.path)}
                        >
                          <span>{isBarExpanded ? subTab.name : null}</span>
                        </Tab>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </TabList>
      </div>
        <div className={`toggle-btn ${isBarExpanded ? 'expanded' : 'collapsed'}`}>
          <ToggleButton
            appearance="transparent"
            icon={
              isBarExpanded ? (
                <ChevronDoubleLeft20Filled />
              ) : (
                <ChevronDoubleRight20Filled />
              )
            }
            onClick={toggleBar}
          />
        </div>
        </div>
    </>
  );
};

export default Sidebar;
