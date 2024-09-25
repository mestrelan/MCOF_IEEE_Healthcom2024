import React from 'react';

interface InteractionSelectorProps {
    options: string[];
    selectedOption: string;
    onChange: (option: string) => void;
    displayValues: { [key: string]: string };
}

const InteractionSelector: React.FC<InteractionSelectorProps> = ({ options, selectedOption, onChange, displayValues }) => {
    const handleOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className='flex flex-row gap-3'>
            <label htmlFor="interactionSelector">Selecionar Interação:</label>
            <select id="interactionSelector" value={selectedOption} onChange={handleOptionChange}>
                {options.map(option => (
                    <option key={option} value={option}>{displayValues[option]}</option>
                ))}
            </select>
        </div>
    );
};

export default InteractionSelector;
