import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { CreateRegionModal } from "../components/CreateRegionModal";

const LayoutTemplate = ( ) => {

	const [open,setOpen] = useState<boolean>(false)

	function openModal(){
		setOpen(true)
	}

	function onClose(){
		setOpen(false)
	}

	return (
		<main>
			<div className="flex flex-row gap-10">
				<Sidebar 
					openModal={openModal}
				/>
				<div>
					<Outlet />
				</div>
			</div>
			<CreateRegionModal 
				open={open}  
				onClose={onClose}
			/>
		</main>
	);
};

export default LayoutTemplate;