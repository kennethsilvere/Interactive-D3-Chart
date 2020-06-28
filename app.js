const DUMMY_DATA = [
    { id: 'd1', region: 'USA', value: 10 },
    { id: 'd2', region: 'India', value: 12 },
    { id: 'd3', region: 'China', value: 11 },
    { id: 'd4', region: 'Germany', value: 6 },
  ];

const MARGINS = { top: 20, bottom: 20 };
const CHART_WIDTH = 600;
const CHART_HEIGHT = 400;

const chartContainer = d3.select('#chart')
                         .select('svg')
                         .attr('width', CHART_WIDTH)
                         .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom);

const chart = chartContainer.append('g');

const xScale = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1);
const yScale = d3.scaleLinear().range([CHART_HEIGHT, 0]);

xScale.domain(DUMMY_DATA.map(d => d.region));
yScale.domain([0, d3.max(DUMMY_DATA, d => d.value) + 3]);

chart.append('g')
     .call(d3.axisBottom(xScale).tickSizeOuter(0))
     .attr('transform', `translate(0, ${CHART_HEIGHT})`)
     .attr('font-size', '1rem');

let selectedItems = DUMMY_DATA;
let unselectedItems = [];

const renderChart = () => {
  const bars = chart.selectAll('.bar')
    .data(selectedItems, d => d.id)
    .enter()
    .append('rect')
    .classed('bar', true)
    .attr('width', xScale.bandwidth())
    .attr('height', d => (CHART_HEIGHT - yScale(d.value)))
    .attr('x', d => xScale(d.region))
    .attr('y', d => yScale(d.value));

  const labels = chart.selectAll('.label')
    .data(selectedItems, d => d.id)
    .enter()
    .append('text')
    .classed('label', true)
    .text(d => d.value)
    .attr('x', d => xScale(d.region) + (xScale.bandwidth() / 2))
    .attr('y', d => yScale(d.value) - 20)
    .attr('text-anchor', 'middle');

  chart.selectAll('.bar')
    .data(selectedItems, d => d.id)
    .exit()
    .remove();

  chart.selectAll('.label')
    .data(selectedItems, d => d.id)
    .exit()
    .remove();
}

renderChart();

const controls = d3.select('#data')
                   .select('ul')
                   .selectAll('li')
                   .data(DUMMY_DATA)
                   .enter()
                   .append('li')
                   .text(d => d.region)
                   .append('input')
                   .attr('type', 'checkbox')
                   .attr('checked', true)
                   .on('change', d => onCheck(d))


const onCheck = (d) => {
  if (unselectedItems.indexOf(d.region) === -1) {
    unselectedItems.push(d.region);
  } else {
    unselectedItems = unselectedItems.filter(i => i !== d.region);
  }
  selectedItems = DUMMY_DATA.filter(item => unselectedItems.indexOf(item.region) === -1);   
  renderChart();     
}