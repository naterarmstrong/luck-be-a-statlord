import { LineChart } from "@mui/x-charts";
import { RunInfo } from "../common/models/run";
import { AVG_NECESSARY, RENT_LENGTHS } from "../utils/runUtils";
import { Box, Typography } from "@mui/material";

interface CoinChartProps {
    runInfo: RunInfo,
}

const CoinChart: React.FC<CoinChartProps> = ({ runInfo }) => {
    if (!runInfo.details) {
        return null;
    }


    const xAxis = [];
    const reqData = [];
    let rentIdx = 0;
    let lastRentStep = 0;
    for (let i = 0; i < runInfo.details.spins.length; i++) {
        if (i - lastRentStep >= RENT_LENGTHS[rentIdx]) {
            rentIdx += 1;
            lastRentStep = i;
        }
        xAxis.push(i + 1);
        reqData.push(AVG_NECESSARY[rentIdx]);
    }
    const yData = runInfo.details.spins.map((s) => s.coinsGained);

    if (runInfo.guillotine) {
        // Remove last element to remove outlier
        xAxis.pop();
        reqData.pop();
        yData.pop();
    }

    const chart = <LineChart
        xAxis={[{ data: xAxis, id: "spins" }]}
        series={[
            {
                data: yData,
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
                Coins per Spin
            </Typography>
            <Box width="100%" justifyContent="center">
                {chart}
            </Box>
        </Box>
    )
}

export default CoinChart