import { LineChart } from "@mui/x-charts";
import { RunInfo } from "../common/models/run";
import { AVG_NECESSARY, RENT_LENGTHS } from "../utils/runUtils";
import { Box, Typography } from "@mui/material";

interface CumulativeCoinChartProps {
    runInfo: RunInfo,
}

const CumulativeCoinChart: React.FC<CumulativeCoinChartProps> = ({ runInfo }) => {
    if (!runInfo.details) {
        return null;
    }


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
            totalNeededSoFar = 0;
        }
        xAxis.push(i + 1);
        totalNeededSoFar += AVG_NECESSARY[rentIdx];
        totalEarnedSoFar += runInfo.details.spins[i].coinsGained;
        reqData.push(totalNeededSoFar);
        earnedData.push(runInfo.details.spins[i].coinTotal);
    }

    const chart = <LineChart
        xAxis={[{ data: xAxis, id: "spins" }]}
        series={[
            {
                data: earnedData,
                curve: "step",
                label: "Earned",
                color: "#ff8300"
            },
            {
                data: reqData,
                label: "Needed",
                curve: "step",
                color: "red",
                id: "needed",
            }
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
                Coin Total
            </Typography>
            <Box width="100%" justifyContent="center">
                {chart}
            </Box>
        </Box>
    )
}

export default CumulativeCoinChart;