import {FC,ReactNode  } from "react";


interface LayersProps {
    children: ReactNode;
}

const Layers: FC<LayersProps> = ({ children } ) => {
	return (
		<div>{ children } </div>
	);
};

export default Layers;