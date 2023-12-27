import { LineChart } from "@mui/x-charts";
import { RunInfo } from "../common/models/run";
import { AVG_NECESSARY, RENT_LENGTHS } from "../utils/runUtils";
import { Box, Typography } from "@mui/material";
import { Symbol } from "../common/models/symbol";

interface CoinBreakdownprops {
    runInfo: RunInfo,
}

const CoinBreakdownChart: React.FC<CoinBreakdownprops> = ({ runInfo }) => {
    if (!runInfo.details) {
        return null;
    }

    console.log(runInfo)

    let symbols: Symbol[] = [];
    let bestSyms = [];
    bestSyms.push(...runInfo.earlySyms.slice(0, 1));
    bestSyms.push(...runInfo.midSyms.slice(0, 2));
    bestSyms.push(...runInfo.details.getBestNSymbols(5));
    for (const symbol of bestSyms) {
        if (!symbols.includes(symbol)) {
            symbols.push(symbol);
        }
    }

    console.log(symbols);

    let totalPerSymbol = symbols.map((_) => 0.0000001);
    const seriesPerSymbol: number[][] = symbols.map((_) => []);

    const xAxis = [];
    const reqData = [];
    const earnedData = [];
    let rentIdx = 0;
    let lastRentStep = 0;
    let totalNeededSoFar = 0;
    let totalEarnedSoFar = 0;

    let loopEnd = runInfo.details.spins.length;
    if (runInfo.guillotine) {
        loopEnd -= 1;
    }
    for (let i = 0; i < loopEnd; i++) {
        if (i - lastRentStep >= RENT_LENGTHS[rentIdx]) {
            rentIdx += 1;
            lastRentStep = i;
        }
        xAxis.push(i + 1);
        totalNeededSoFar += AVG_NECESSARY[rentIdx];

        // Amount earned by symbols not on the symbols list
        // We do this subtractively, as that is easier to manage
        let gainedOther = runInfo.details.spins[i].coinsGained;
        for (let j = 0; j < 20; j++) {
            const symbol = runInfo.details.spins[i].preEffectLayout[j].symbol;
            const value = runInfo.details.spins[i].symbolValues[j].coins;
            if (symbols.includes(symbol)) {
                gainedOther -= value;
                totalPerSymbol[symbols.indexOf(symbol)] += value;
            }
        }

        for (let j = 0; j < symbols.length; j++) {
            seriesPerSymbol[j].push(totalPerSymbol[j]);
        }

        totalEarnedSoFar += gainedOther;
        reqData.push(totalNeededSoFar);
        earnedData.push(totalEarnedSoFar);
    }

    const series = symbols.map((s, i) => {
        return {
            data: seriesPerSymbol[i],
            label: s,
            area: true,
            stack: "total"
        }
    });

    const chart = <LineChart
        xAxis={[{ data: xAxis, id: "spins" }]}
        series={[
            {
                data: earnedData,
                area: true,
                stack: "total",
                label: "Other",
                color: "#ff8300"
            },
            {
                data: reqData,
                label: "Needed",
                curve: "step",
                color: "red",
                id: "needed",
            },
            ...series
        ]}
        sx={{
            '.MuiLineElement-root': {
                strokeWidth: 2,
            },
            '.MuiMarkElement-root': {
                scale: '0',
                strokeWidth: 2,
            },
            '.MuiLineElement-series-needed': {
                strokeDasharray: '5 5',
            },
        }}
        slotProps={{
            legend: {
                labelStyle: {
                    fontSize: 40
                }
            },
            axisLabel: {
                fontSize: 40
            },
            axisTickLabel: {
                fontSize: 30
            },
        }}
        bottomAxis={{
            label: "Spin",
            labelStyle: {
                fontSize: 40
            },
            tickSize: 6,
            tickLabelStyle: {
                fontSize: 30,
            },
            axisId: "spins"
        }}
        leftAxis={{
            label: "Coins",
            labelStyle: {
                fontSize: 40,
            },
            tickLabelStyle: {
                fontSize: 30,
            },
            axisId: "DEFAULT_Y_AXIS_KEY"
        }}
        width={1000}
        height={500}
    />;

    return (
        <Box justifyContent="center" display="flex" flexDirection="column">
            <Typography variant="h4">
                Cumulative Coin Breakdown
            </Typography>
            <Box width="100%" justifyContent="center">
                {chart}
            </Box>
        </Box>
    )
}

export default CoinBreakdownChart;