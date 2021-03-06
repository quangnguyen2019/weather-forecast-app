import React, { useEffect, useState } from 'react';

import { IData } from '../global';
import MainAddressCard from './MainAddressCard';
import ExtraAddressCard from './ExtraAddressCard';

interface IProps {
    dataApp: IData[];
    setDataApp: React.Dispatch<React.SetStateAction<IData[]>>;
}

const CurrentWeather = ({ dataApp, setDataApp }: IProps) => {
    const [dropdowns, setDropdowns] = useState(
        dataApp.map(() => ({ isOpen: false }))
    );

    const onClickCard = (e: React.MouseEvent<Element>) => {
        // get index of clicked card via 'data-index' attribute
        let index: any = e.currentTarget.getAttribute('data-index');
        index = ~~index; // convert string to number

        // Change position of clicked card (address) to top
        const tempData = dataApp.slice();
        const locationRepositioned = tempData.splice(index, 1)[0];
        tempData.splice(0, 0, locationRepositioned);
        setDataApp(tempData);

        // Set Local Storage
        localStorage.dataWeather = JSON.stringify(tempData);
    };

    const onClickDropdownBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
        // Disallow triggering onClick callback on parent element
        e.stopPropagation();

        let indexDropdown: any = e.currentTarget.getAttribute('data-index');
        // convert indexDropdown to number
        indexDropdown *= 1; // "34" * 1 => 34
        setDropdowns([
            ...dropdowns.slice(0, indexDropdown),
            { isOpen: !dropdowns[indexDropdown].isOpen },
            ...dropdowns.slice(indexDropdown + 1),
        ]);
    };

    const onClickRemoveCard = (index: number) => {
        const tempData = dataApp.slice();
        const tempDropdowns = dropdowns.slice();

        tempData.splice(index, 1);
        tempDropdowns.splice(index, 1);

        setDataApp(tempData);
        setDropdowns(tempDropdowns);

        // Set Local Storage
        localStorage.dataWeather = JSON.stringify(tempData);
    };

    const handleClickOutside = ({ target }: MouseEvent) => {
        let arrButtonDropdowns = Array.from(
            document.querySelectorAll('.button-options')
        );

        // get expanding dropdown
        let indexDropdown = -1;
        dropdowns.every((obj, index) => {
            if (obj.isOpen) {
                indexDropdown = index;
                return false;
            }
            return true;
        });

        if (
            indexDropdown !== -1 &&
            !arrButtonDropdowns[indexDropdown].contains(target as HTMLElement)
        ) {
            setDropdowns([
                ...dropdowns.slice(0, indexDropdown),
                { isOpen: false },
                ...dropdowns.slice(indexDropdown + 1),
            ]);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    // update dropdowns state when dataApp changed
    useEffect(() => {
        if (dataApp.length > dropdowns.length) {
            setDropdowns([...dropdowns, { isOpen: false }]);
        }
    }, [dataApp]);

    return (
        <section className="current-weather row gx-3 gy-2 mt-3">
            <div className="col-12 col-md-7 col-lg-6 col-xl-12 mt-3 mt-md-0">
                <MainAddressCard
                    dataApp={dataApp}
                    dropdowns={dropdowns}
                    onClickDropdownBtn={onClickDropdownBtn}
                    onClickRemoveCard={onClickRemoveCard}
                />
            </div>

            <div className="col-12 col-md-5 col-lg-6 col-xl-12 mt-0 mt-xl-2 position-relative">
                <ExtraAddressCard
                    dataApp={dataApp}
                    dropdowns={dropdowns}
                    onClickDropdownBtn={onClickDropdownBtn}
                    onClickRemoveCard={onClickRemoveCard}
                    onClickCard={onClickCard}
                />
            </div>
        </section>
    );
};

export default CurrentWeather;
