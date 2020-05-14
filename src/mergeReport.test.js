const mergeCucumberReports = require('./mergeReport')

const generateSteps = (stepName = 'step name') => ({
    arguments: [],
    keyword: 'Given ',
    line: 4,
    name: stepName,
    match: {
        location: 'dist/steps/applaunch.js:25'
    },
    result: {
        status: 'passed',
        duration: 73850000000
    }
})

const generateScenario = (scenarioName = 'Scenario Name', steps = [generateSteps()]) => ({
    id: 'scenario ID',
    keyword: 'Scenario',
    line: 9,
    name: scenarioName,
    tags: [{
        'name': '@userbase',
        'line': 8
    }],
    type: 'scenario',
    steps
})

const generateFeature = (featureName = 'default', scenarios = [generateScenario()]) => ([{
    keyword: 'Feature',
    name: featureName,
    line: 1,
    id: featureName,
    tags: [],
    uri: 'features/functional/negative/Registration-Invalid.feature',
    elements: scenarios
}])

describe('Merge Report', () => {
    it('Should return the same feature', () => expect(mergeCucumberReports([generateFeature()])).toEqual(generateFeature()))

    it('Should merge two different features together', () => {
        const scenario1 = generateScenario('first')
        const scenario2 = generateScenario('second')

        const feature1 = generateFeature('feature1', [scenario1])
        const feature2 = generateFeature('feature2', [scenario2])

        const [firstFeature, secondFeature] = mergeCucumberReports([feature1, feature2])
        expect(firstFeature.name).toEqual('feature1')
        expect(secondFeature.name).toEqual('feature2')

        expect(firstFeature.elements[0].name).toEqual('first')
        expect(secondFeature.elements[0].name).toEqual('second')
    })

    it('Should combine two of the same features together', () => {
        const scenario1 = generateScenario('first')
        const scenario2 = generateScenario('second')

        const feature1 = generateFeature('feature1', [scenario1])
        const feature2 = generateFeature('feature1', [scenario2])

        const [ mergedReport ] = mergeCucumberReports([feature1, feature2])
        const [mergedScenario1, mergedScenario2 ] = mergedReport.elements
         expect(mergedScenario1.name).toEqual('first')
         expect(mergedScenario2.name).toEqual('second')
    })

    it('Should overwrite scenarios with features that have the same name', () => {
        const scenario1 = generateScenario('first')
        const scenario2 = generateScenario('second')

        const differentStep = generateSteps('a changed step')
        const scenario3 = generateScenario('first', [differentStep])

        const feature1 = generateFeature('feature1', [scenario1, scenario2])
        const feature2 = generateFeature('feature1', [scenario3])

        const [ mergedReport ] = mergeCucumberReports([feature1, feature2])
        const [mergedScenario1, mergedScenario2 ] = mergedReport.elements

        expect(mergedScenario1.steps[0].name).toEqual('a changed step')
        expect(mergedScenario2.name).toEqual('second')
    })
})
