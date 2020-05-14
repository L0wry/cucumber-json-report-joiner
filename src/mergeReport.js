
const mergeCucumberReports = reports => reports.reduce((combinedReports, features) => {
    const isFound = -1
  
    for (const feature of features) {
      const existingFeatureInMergedReport = combinedReports.findIndex(existingReport => existingReport.name === feature.name)
  
      if (existingFeatureInMergedReport > isFound) {
        for (const scenario of feature.elements) {
          const existingScenarioInMergedFeatures = combinedReports[existingFeatureInMergedReport].elements.findIndex(existingScenario => existingScenario.name === scenario.name)
          
          if (existingScenarioInMergedFeatures > isFound) {
            combinedReports[existingFeatureInMergedReport].elements[existingScenarioInMergedFeatures] = {
              ...existingScenarioInMergedFeatures,
              ...scenario,
            }
          } else {
            combinedReports[existingFeatureInMergedReport].elements.push(scenario)
          }
        }

      } else {
        combinedReports.push(feature)
      }
    }
  
    return combinedReports;
  }, [])

module.exports = mergeCucumberReports;