"use client"
import { Spin } from "antd"
import { useEffect, useState } from "react"

export default function Loading(status:boolean) {
    const [spinning, setSpinning] = useState(false);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
        showLoader();
    },[status])

    const showLoader = () => {
        setSpinning(true);
        let ptg = -10;

        const interval = setInterval(() => {
            ptg += 5;
            setPercent(ptg);

            if (ptg > 120) {
                clearInterval(interval);
                setSpinning(false);
                setPercent(0);
            }
        }, 100);
    }

    return (
        <>
            <Spin spinning={ spinning } percent={percent} size="large" fullscreen />
        </>
    )
}