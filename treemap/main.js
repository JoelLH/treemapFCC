

const width = 1000;
const height = 750;

let canvas = d3.select('body').append('svg')
                .attr('width', width)
                .attr('height', height);

let tooltip = d3.select('body')
                .append('div')
                .attr('id', "tooltip")

let legend = d3.select('body')
                .append('svg')
                .attr('id', 'legend')
                .attr('class', 'legend')
                .attr('width', 400)
                .attr('heigt', 300)
                .style('margin-top', 20)

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json')
    .then(data=>{

        const hierarchy = d3.hierarchy(data)
                            .sum(d=> d.value)
                            .sort((a,b)=> b.value - a.value);

        let treemap = d3.treemap()
            .size([width, height])
            .padding(1);
        
        const root = treemap(hierarchy)
        const names = data.children.map(d=> d.name);

        const colorScale = d3.scaleOrdinal()
                            .domain(names)
                            .range(d3.schemePaired)


        canvas.selectAll('rect')
                .data(root.leaves())
                .enter()
                .append('rect')
                .attr('x', d=> d.x0)
                .attr('y', d=> d.y0)
                .attr('width', d=> d.x1 - d.x0)
                .attr('height', d=> d.y1 - d.y0)
                .attr('fill', d=> colorScale(d.data.category))
                .attr('class', 'tile')
                .attr('data-name', d=> d.data.name)
                .attr('data-category', d=> d.data.category)
                .attr('data-value', d=> d.data.value)
                
        let texts = canvas.selectAll('text')
                .data(root.leaves())
                .enter()
                .append('text')
                .attr('x', d=> d.x0 + 5)
                .attr('y', d=>d.y0)
                .html(d=>{
                    let wordArr = d.data.name.split(' ')
                    let html = ""
                    wordArr.map((word, i)=>{
                        html += `<tspan 
                        y="${(d.y0 + 10)+(i * 7)}"
                        x='${d.x0 + 5}'
                        >
                        ${word}
                        </tspan>`
                    })
                    return html
                })

        canvas.selectAll('rect')
                .on('mouseover', function(e){
                    let mX = e.clientX
                    let mY = e.clientY


                    tooltip.style("top", `${mY + 10}px`)
                    tooltip.style("left", `${mX + 10}px`)
                    tooltip.style("display", `block`)

                    tooltip.attr('data-value', `${e.target.dataset.value}`)

                    tooltip.html(`${e.target.dataset.name} <br>
                    (${e.target.dataset.category}), value: ${e.target.dataset.value}`)
                })

        canvas.selectAll('rect')
                .on('mouseout', function(){
                    tooltip.style("display", `none`)
                })
        
        legend.selectAll('rect')
                .data(names)
                .enter()
                .append('rect')
                .attr('width', 20)
                .attr('height', 20)
                .attr('x', (d,i)=>{
                    return i < 6 ? 0 : i < 12 ?  133 : 266
                })
                .attr('y',(d, i)=>{
                    return i < 6 ? 24 * i : i < 12 ? 24 * (i - 6) : 24 * (i - 12)   
                })
                .attr('fill', d => colorScale(d))
                .attr('class', 'legend-item')

        legend.selectAll('text')
                .data(names)
                .enter()
                .append('text')
                .text(d=> d)
                .attr('x', (d,i)=>{
                    return i < 6 ? 24 : i < 12 ?  157 : 290
                })
                .attr('y',(d, i)=>{
                    return i < 6 ? 23.5 * i + 15: i < 12 ? 23.5 * (i - 6) + 15 : 23.5 * (i - 12) + 15  
                })
    })