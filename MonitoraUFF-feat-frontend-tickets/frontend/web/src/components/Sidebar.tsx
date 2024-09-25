import { useEffect, useState } from 'react';
import {  Divider } from '@mui/material';
import {RegionTreeView} from './RegionTreeView';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CachedIcon from '@mui/icons-material/Cached';
import { Link } from 'react-router-dom';
import { useRegion } from '../hooks/useRegion';

interface SidebarProps{
  openModal:()=>void;
}


const Sidebar = ({openModal}:SidebarProps) => {

  const { hierarchy, Hierarchy } = useRegion();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await Hierarchy();
    };

    fetchData();
  }, []);

  function refreshPage() {
    window.location.reload();
  }

  function toggleSidebar(){
    setIsOpen(!isOpen);
  }

  return (
        <div className={`flex flex-col items-center p-2 border-r-2 h-screen  ${isOpen ? "flex-row" : "flex-col"}`}>
          <button  onClick={toggleSidebar} className="flex justify-center w-full">
            <MenuIcon />
          </button>
            <nav
              className={`flex gap-4 p-2,
              ${isOpen ? "flex-col" : "flex-row"}
              `}
            >
              {/* ADD REGION */}
              <button
                onClick={openModal}
                className="hover:bg-[#f5f5f5] p-2"
              >
                <AddIcon />
              </button>
              {/* DRAW FEATURES */}
              <Link to={'?edit=true'}>
                <button className="hover:bg-[#f5f5f5] p-2">
                  <EditIcon />
                </button>
              </Link>
              {/* TICKETS */}
              <Link to={'/tickets'}>
                <button  
                  className="hover:bg-[#f5f5f5] p-2"
                >
                  <ConfirmationNumberIcon />
                </button>
              </Link>
              {/* REFRESH PAGE */}
              <button
                className="hover:bg-[#f5f5f5] p-2"
                onClick={refreshPage}
              >
                <CachedIcon />
              </button>
            </nav>
            <Divider className='w-full ' />
            {!isOpen && hierarchy && ( 
              <>
                <RegionTreeView hierarchyRegions={hierarchy} />
              </>
            )}
        </div>
  );
};

export default Sidebar;