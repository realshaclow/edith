/**
 * Skrypt testowy dla Study Execution API
 * 
 * Ten skrypt demonstruje pełny cykl życia wykonania badania:
 * 1. Tworzenie wykonania badania
 * 2. Rozpoczęcie wykonania
 * 3. Zarządzanie próbkami
 * 4. Dodawanie pomiarów
 * 5. Eksport wyników
 * 6. Zapis w systemie EDITH
 */

// Konfiguracja
const API_BASE = 'http://localhost:3001/api';
const TEST_DATA = {
  studyId: 'test-study-001',
  studyName: 'Test wytrzymałości na rozciąganie - ABS',
  protocolName: 'ASTM D638-14',
  category: 'Mechanical Testing',
  operatorId: 'operator-001',
  environment: {
    temperature: 23.5,
    humidity: 45.2,
    pressure: 1013.25,
    airflow: 0.2
  },
  testConditions: {
    temperature: 25.0,
    humidity: 50.0,
    force: 1000,
    speed: 5.0,
    duration: 3600
  },
  samples: [
    {
      name: 'ABS-001',
      description: 'Próbka ABS - injection molded',
      material: 'ABS (Acrylonitrile Butadiene Styrene)',
      properties: {
        thickness: 3.2,
        width: 10.0,
        length: 165.0,
        density: 1.05
      },
      batchNumber: 'BATCH-2024-001',
      lotNumber: 'LOT-A-001'
    },
    {
      name: 'ABS-002',
      description: 'Próbka ABS - injection molded',
      material: 'ABS (Acrylonitrile Butadiene Styrene)',
      properties: {
        thickness: 3.1,
        width: 10.0,
        length: 165.0,
        density: 1.05
      },
      batchNumber: 'BATCH-2024-001',
      lotNumber: 'LOT-A-002'
    }
  ],
  estimatedDuration: 'PT2H30M',
  notes: 'Test przeprowadzony zgodnie z procedurą ASTM D638-14',
  tags: ['abs', 'tensile', 'mechanical', 'astm-d638']
};

// Helper do API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token',
      ...options.headers
    },
    ...options
  };

  console.log(`🌐 ${config.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`❌ Error ${response.status}:`, data);
      throw new Error(data.error || 'API Error');
    }
    
    console.log(`✅ Success:`, data.success ? '✓' : '✗');
    return data;
  } catch (error) {
    console.error(`💥 Request failed:`, error.message);
    throw error;
  }
}

// Test scenarios
async function testCreateExecution() {
  console.log('\n📋 === TWORZENIE WYKONANIA BADANIA ===');
  
  const result = await apiCall('/study-executions', {
    method: 'POST',
    body: JSON.stringify(TEST_DATA)
  });
  
  console.log(`📊 Execution ID: ${result.data.id}`);
  console.log(`📈 Status: ${result.data.status}`);
  console.log(`🧪 Samples: ${result.data.samples?.length || 0}`);
  
  return result.data;
}

async function testStartExecution(executionId) {
  console.log('\n🚀 === ROZPOCZĘCIE WYKONANIA ===');
  
  const result = await apiCall(`/study-executions/${executionId}/start`, {
    method: 'POST'
  });
  
  console.log(`📈 New status: ${result.data.status}`);
  console.log(`⏰ Started at: ${result.data.startedAt}`);
  
  return result.data;
}

async function testSampleWorkflow(execution) {
  console.log('\n🧪 === ZARZĄDZANIE PRÓBKAMI ===');
  
  for (const sample of execution.samples) {
    console.log(`\n🔬 Processing sample: ${sample.name}`);
    
    // Start sample
    await apiCall(`/study-executions/samples/${sample.id}/start`, {
      method: 'POST'
    });
    console.log(`  ✅ Sample started`);
    
    // Add measurements
    const measurements = [
      {
        sampleId: sample.id,
        stepId: 'step-001',
        measurementId: 'yield-strength',
        value: Math.random() * 50 + 20, // 20-70 MPa
        unit: 'MPa',
        operator: TEST_DATA.operatorId,
        equipment: 'tensile-tester-001',
        method: 'ASTM D638 Method I',
        conditions: {
          temperature: 23.5,
          humidity: 45.2,
          speed: 5.0
        },
        notes: 'Yield strength measurement'
      },
      {
        sampleId: sample.id,
        stepId: 'step-002',
        measurementId: 'ultimate-strength',
        value: Math.random() * 30 + 40, // 40-70 MPa
        unit: 'MPa',
        operator: TEST_DATA.operatorId,
        equipment: 'tensile-tester-001',
        method: 'ASTM D638 Method I',
        conditions: {
          temperature: 23.5,
          humidity: 45.2,
          speed: 5.0
        },
        notes: 'Ultimate tensile strength measurement'
      },
      {
        sampleId: sample.id,
        stepId: 'step-003',
        measurementId: 'elongation-at-break',
        value: Math.random() * 20 + 5, // 5-25%
        unit: '%',
        operator: TEST_DATA.operatorId,
        equipment: 'tensile-tester-001',
        method: 'ASTM D638 Method I',
        conditions: {
          temperature: 23.5,
          humidity: 45.2,
          speed: 5.0
        },
        notes: 'Elongation at break measurement'
      }
    ];
    
    for (const measurement of measurements) {
      await apiCall('/study-executions/measurements', {
        method: 'POST',
        body: JSON.stringify(measurement)
      });
      console.log(`  📏 Added measurement: ${measurement.measurementId} = ${measurement.value.toFixed(2)} ${measurement.unit}`);
    }
    
    // Complete sample
    await apiCall(`/study-executions/samples/${sample.id}/complete`, {
      method: 'POST',
      body: JSON.stringify({
        quality: 'pass',
        notes: `Sample ${sample.name} completed successfully with all measurements within specification`
      })
    });
    console.log(`  ✅ Sample completed`);
  }
}

async function testCompleteExecution(executionId) {
  console.log('\n🏁 === ZAKOŃCZENIE WYKONANIA ===');
  
  const result = await apiCall(`/study-executions/${executionId}/complete`, {
    method: 'POST',
    body: JSON.stringify({
      summary: 'All samples tested successfully. Results show good mechanical properties consistent with ABS specifications.',
      recommendations: 'Material meets requirements for intended application. Consider optimizing injection molding parameters for better consistency.'
    })
  });
  
  console.log(`📈 Final status: ${result.data.status}`);
  console.log(`📊 Progress: ${result.data.progress}%`);
  console.log(`⏰ Completed at: ${result.data.completedAt}`);
  
  return result.data;
}

async function testExportResults(executionId) {
  console.log('\n📤 === EKSPORT WYNIKÓW ===');
  
  const exportFormats = [
    {
      format: 'PDF',
      type: 'COMPLETE_REPORT',
      includeCharts: true,
      includeSamples: true,
      includeRawData: true
    },
    {
      format: 'EXCEL',
      type: 'SAMPLE_RESULTS',
      includeSamples: true,
      includeRawData: false
    },
    {
      format: 'JSON',
      type: 'MEASUREMENTS_ONLY',
      includeRawData: true
    }
  ];
  
  for (const exportConfig of exportFormats) {
    const result = await apiCall(`/study-executions/${executionId}/exports`, {
      method: 'POST',
      body: JSON.stringify(exportConfig)
    });
    
    console.log(`📋 Created ${exportConfig.format} export: ${result.data.id}`);
    console.log(`  📊 Type: ${exportConfig.type}`);
    console.log(`  📅 Requested at: ${result.data.requestedAt}`);
  }
  
  // Get all exports
  const exportsResult = await apiCall(`/study-executions/${executionId}/exports`);
  console.log(`📦 Total exports: ${exportsResult.data.length}`);
}

async function testSaveToEdith(executionId) {
  console.log('\n💾 === ZAPIS W SYSTEMIE EDITH ===');
  
  const result = await apiCall(`/study-executions/${executionId}/save`, {
    method: 'POST'
  });
  
  console.log(`💾 Saved to EDITH system`);
  console.log(`📊 Execution ID: ${result.data.executionId}`);
  console.log(`🧪 Samples: ${result.data.samplesCount}`);
  console.log(`📏 Measurements: ${result.data.measurementsCount}`);
  console.log(`⏰ Saved at: ${result.data.savedAt}`);
}

async function testGetExecutions() {
  console.log('\n📋 === POBIERANIE LISTY WYKONAŃ ===');
  
  const result = await apiCall('/study-executions?limit=5&sortOrder=desc');
  
  console.log(`📊 Found ${result.pagination.total} executions`);
  console.log(`📄 Page ${result.pagination.page} of ${result.pagination.totalPages}`);
  
  for (const execution of result.data) {
    console.log(`  🔬 ${execution.studyName} - ${execution.status} (${execution.createdAt})`);
  }
}

// Main test function
async function runFullTest() {
  console.log('🧪 === EDITH STUDY EXECUTION API TEST ===');
  console.log(`🌐 API Base: ${API_BASE}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}\n`);
  
  try {
    // 1. Create execution
    const execution = await testCreateExecution();
    
    // 2. Start execution
    await testStartExecution(execution.id);
    
    // 3. Process samples and measurements
    await testSampleWorkflow(execution);
    
    // 4. Complete execution
    await testCompleteExecution(execution.id);
    
    // 5. Export results
    await testExportResults(execution.id);
    
    // 6. Save to EDITH system
    await testSaveToEdith(execution.id);
    
    // 7. List executions
    await testGetExecutions();
    
    console.log('\n🎉 === TEST COMPLETED SUCCESSFULLY ===');
    console.log(`✅ All API endpoints tested`);
    console.log(`📊 Full workflow executed`);
    console.log(`⏰ Finished at: ${new Date().toISOString()}`);
    
  } catch (error) {
    console.error('\n💥 === TEST FAILED ===');
    console.error(`❌ Error: ${error.message}`);
    console.error(`⏰ Failed at: ${new Date().toISOString()}`);
    process.exit(1);
  }
}

// Quick test for individual endpoints
async function testBasicOperations() {
  console.log('🚀 === BASIC API TEST ===\n');
  
  try {
    // Test health/basic connectivity
    const health = await apiCall('/health', { method: 'GET' });
    console.log(`🏥 Health check: ${health.status}`);
    
    // Test list executions (should work even if empty)
    await testGetExecutions();
    
    console.log('\n✅ Basic operations test passed');
    
  } catch (error) {
    console.error('\n❌ Basic test failed:', error.message);
  }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runFullTest,
    testBasicOperations,
    apiCall,
    TEST_DATA
  };
}

// Run test if called directly
if (require.main === module) {
  const testType = process.argv[2] || 'full';
  
  if (testType === 'basic') {
    testBasicOperations();
  } else {
    runFullTest();
  }
}
