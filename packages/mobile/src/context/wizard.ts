import React from "react";

export interface IWizardContext {
    currentRootChildIndex: number,
    pagerModeIndices: {[key: string]: number[]},
    childNodes: string[],
    handleJump: (i: number) => void,
    handlePrev: () => void,
    handleNext: () => void,
    updatePagerModeIndex: (sectionId: string, newIndex: number, iteration?: number)=>void,
    itemRefs: {[key:string]:any},
    setRefs: (ref: any, location: string)=>void;
    getRef: (location:string)=>any;
    handleSubmitOrSwipe: (location:string)=>void;
}
export const WizardContext = React.createContext({
    currentRootChildIndex: 0,
    childNodes: [],
    handleJump: (index: number) => { },
    handleNext: () => { console.log('unimplemented') },
    handlePrev: () => { }
} as IWizardContext);
