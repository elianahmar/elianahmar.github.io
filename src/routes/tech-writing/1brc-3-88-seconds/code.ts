export const p1Code = `func (p1 *P1) Compute() map[string]*model.Measurement { // 509 seconds
	dataChan := make(chan string, p1.ChanSize)
	wg := &sync.WaitGroup{}
	file, _ := os.Open(p1.Path)
	defer file.Close()

	fileScanner := bufio.NewScanner(file)
	fileScanner.Split(bufio.ScanLines)

	measurementChan := make(chan map[string]*model.Measurement, 1)

	wg.Add(2)
	go p1.pushLines(fileScanner, dataChan, p1.ChanSize, wg)
	go p1.collectData(dataChan, measurementChan, p1.ChanSize, wg)
	wg.Wait()

	return <-measurementChan
}

func (p1 *P1) collectData(data chan string, measurementChan chan map[string]*model.Measurement, linesToProcess int, wg *sync.WaitGroup) {
	defer wg.Done()
	measurements := make(map[string]*model.Measurement, 500)
	for text := range data {
		city, temp := p1.processLine(text)
		if _, exists := measurements[city]; !exists {
			measurements[city] = &model.Measurement{City: city}
		}
		measurements[city].Temps += temp
		measurements[city].Count += 1
		measurements[city].Max = math.Max(measurements[city].Max, temp)
		measurements[city].Min = math.Min(measurements[city].Min, temp)
	}
	measurementChan <- measurements
	close(measurementChan)
}

func (p1 *P1) pushLines(fileScanner *bufio.Scanner, dataChan chan string, chanSize int, wg *sync.WaitGroup) {
	defer wg.Done()
	p1.naiveLineScanner(fileScanner, dataChan, chanSize)
	close(dataChan)
}`;

export const p4Code = `func (p4 *P4) Compute() map[string]*model.Measurement { // 117 seconds
	file, _ := os.Open(p4.Path)
	defer file.Close()
	fileScanner := bufio.NewScanner(file)
	delim := []byte{';'}
	measurements := make(map[string]*model.Measurement, 512)
	for fileScanner.Scan() {
		line := fileScanner.Bytes()
		city, num, _ := bytes.Cut(line, delim)
		cityName := string(city)
		temp, _ := strconv.ParseFloat(string(num), 64)
		if _, exists := measurements[cityName]; !exists {
			measurements[cityName] = &model.Measurement{City: cityName}
		}
		measurements[cityName].Temps += temp
		measurements[cityName].Count += 1
		measurements[cityName].Max = math.Max(measurements[cityName].Max, temp)
		measurements[cityName].Min = math.Min(measurements[cityName].Min, temp)
	}
	return measurements
}`;

export const p5Code = `func (p5 *P5) Compute() map[string]*model.Measurement { // 56 seconds
	file, _ := os.Open(p5.Path)
	defer file.Close()
	fileScanner := bufio.NewScanner(file)
	delim := []byte{';'}
	measurements := make(map[string]*model.Measurement, 512)
	for fileScanner.Scan() {
		line := fileScanner.Bytes()
		city, num, _ := bytes.Cut(line, delim)
		cityLookup := unsafe.String(&city[0], len(city)) // zero-cost lookup — no copy
		temp, _ := strconv.ParseFloat(string(num), 64)
		measurement, exists := measurements[cityLookup]
		if !exists {
			cityName := string(city) // only allocate when city is new
			measurement = &model.Measurement{City: cityName}
			measurements[cityName] = measurement
		}
		measurement.Temps += temp
		measurement.Count += 1
		measurement.Max = math.Max(measurement.Max, temp)
		measurement.Min = math.Min(measurement.Min, temp)
	}
	return measurements
}`;

export const p9Code = `func (p9 *P9) Compute() map[string]*model.MeasurementInt { // 44 seconds
	// Allocating numByte here keeps it on the stack — no heap escape
	numByte := make([]byte, 0, 8)
	parse := func(num []byte) (int, error) {
		numByte = numByte[:0] // clear without reallocating
		for i := range num {
			nb := num[i]
			if nb == '.' {
				continue
			}
			numByte = append(numByte, nb)
		}
		return strconv.Atoi(unsafe.String(&numByte[0], len(numByte)))
	}

	file, _ := os.Open(p9.Path)
	defer file.Close()
	fileScanner := bufio.NewScanner(file)
	fileScanner.Buffer(make([]byte, 2*1024*1024), 1024*1024)
	delim := []byte{';'}
	measurements := make(map[string]*model.MeasurementInt, 512)
	for fileScanner.Scan() {
		line := fileScanner.Bytes()
		city, num, _ := bytes.Cut(line, delim)
		temp, _ := parse(num)
		measurement, exists := measurements[unsafe.String(&city[0], len(city))]
		if !exists {
			cityName := string(city)
			measurement = &model.MeasurementInt{City: cityName}
			measurements[cityName] = measurement
		}
		measurement.Temps += temp
		measurement.Count += 1
		measurement.Max = max(measurement.Max, temp)
		measurement.Min = min(measurement.Min, temp)
	}
	return measurements
}`;

export const p11Code = `func (p11 *P11) Compute() map[string]*model.MeasurementInt { // 38 seconds
	numByte := make([]byte, 0, 8)
	delim, period := byte(';'), byte('.')
	L, N, temp := 0, 0, 0

	// Manually scan to ';', then scan temperature bytes — no bytes.Cut()
	parse := func(line []byte) (int, int) {
		numByte = numByte[:0]
		L, N = 0, len(line)
		for line[L] != delim {
			L += 1
		}
		delimIdx := L
		L += 1
		for L < N {
			nb := line[L]
			if nb != period {
				numByte = append(numByte, nb)
			}
			L += 1
		}
		temp, _ = strconv.Atoi(unsafe.String(&numByte[0], len(numByte)))
		return temp, delimIdx
	}

	file, _ := os.Open(p11.Path)
	fileScanner := bufio.NewScanner(file)
	fileScanner.Buffer(make([]byte, 2*1024*1024), 1024*1024)
	measurements := make(map[string]*model.MeasurementInt, 512)
	for fileScanner.Scan() {
		line := fileScanner.Bytes()
		temp, delimIdx := parse(line)
		measurement, exists := measurements[unsafe.String(&line[0], delimIdx)]
		if !exists {
			cityName := string(line[0:delimIdx])
			measurement = &model.MeasurementInt{City: cityName}
			measurements[cityName] = measurement
		}
		measurement.Temps += temp
		measurement.Count += 1
		measurement.Max = max(measurement.Max, temp)
		measurement.Min = min(measurement.Min, temp)
	}
	return measurements
}`;

export const p13Code = `// ChunkFileImproved uses bytes.LastIndexByte to ensure every chunk ends on a newline boundary.
func ChunkFileImproved(path string) []model.Range {
	file, _ := os.Open(path)
	chunkSize := 4 * 1024 * 1024 // 4 MB
	info, _ := file.Stat()
	buffer := make([]byte, chunkSize)
	fileSize := info.Size()
	ranges := make([]model.Range, 0, fileSize/int64(chunkSize)+1)
	lastOffset := int64(0)
	newline := byte('\\n')
	for {
		bytesRead, err := file.ReadAt(buffer, lastOffset)
		if err != nil && err != io.EOF {
			panic("error reading file")
		}
		if bytesRead == 0 {
			break
		}
		lastNewline := int64(bytes.LastIndexByte(buffer, newline))
		ending := lastOffset + lastNewline
		ranges = append(ranges, model.Range{Start: lastOffset, End: ending})
		lastOffset = ending + 1
	}
	return ranges
}

func (p13 *P13) Compute() map[string]*model.MeasurementInt { // 12 seconds
	ranges := files.ChunkFileImproved(p13.Path)
	mChan := make(chan map[string]*model.MeasurementInt, len(ranges))
	wg := sync.WaitGroup{}
	file, _ := os.Open(p13.Path)

	wg.Add(len(ranges))
	for _, r := range ranges {
		go func(r model.Range, mChan chan map[string]*model.MeasurementInt, file *os.File) {
			defer wg.Done()
			p13.processRange(r, mChan, file)
		}(r, mChan, file)
	}
	go func() {
		wg.Wait()
		close(mChan)
	}()

	finalMeasure := make(map[string]*model.MeasurementInt, 512)
	for localMeasurement := range mChan {
		for city, newMeasure := range localMeasurement {
			measurement, exists := finalMeasure[city]
			if !exists {
				measurement = &model.MeasurementInt{City: city}
				finalMeasure[city] = measurement
			}
			measurement.Temps += newMeasure.Temps
			measurement.Count += newMeasure.Count
			measurement.Max = max(measurement.Max, newMeasure.Max)
			measurement.Min = min(measurement.Min, newMeasure.Min)
		}
	}
	return finalMeasure
}`;

export const digitCode = `temp = 0
for ptr < n {
    nb := buff[ptr]
    if nb == newline {
        break
    }
    if zero <= nb && nb <= nine {
        temp = temp*10 + int(nb-zero)
    }
    ptr++
}
if buff[cityEnd+1] == minus {
    temp *= -1
}`;

export const ptrCode = `ptr := 0
for ptr < n {
    // Phase 1: scan city bytes up to ';'
    start := ptr
    for buff[ptr] != semicolon {
        ptr++
    }
    cityEnd := ptr
    city := unsafe.String(&buff[start], ptr-start)

    // Phase 2: skip ';', then scan temperature bytes up to '\\n'
    ptr++
    temp = 0
    for ptr < n {
        nb := buff[ptr]
        if nb == newline {
            break
        }
        if zero <= nb && nb <= nine {
            temp = temp*10 + int(nb-zero)
        }
        ptr++
    }
    if buff[cityEnd+1] == minus {
        temp *= -1
    }
    ptr++ // step past newline
    // ... update local map ...
}`;

export const p17Code = `func (p17 *P17) Compute() map[string]*model.MeasurementInt { // 3.88 seconds
	rChan := make(chan model.Range, 1000)
	rSig := make(chan bool)
	mChan := make(chan map[string]*model.MeasurementInt, 1000)
	file, _ := os.Open(p17.Path)

	// Goroutine 1: produce file ranges asynchronously
	go files.ChunkFileAsync(p17.Path, rChan)

	// Goroutine 2: spawn a worker per range; signal when all are done
	go func(mChan chan map[string]*model.MeasurementInt, file *os.File) {
		wg := &sync.WaitGroup{}
		for r := range rChan {
			wg.Add(1)
			go func(r model.Range, mChan chan map[string]*model.MeasurementInt, file *os.File, wg *sync.WaitGroup) {
				p17.processRange(r, mChan, file, wg)
			}(r, mChan, file, wg)
		}
		wg.Wait()
		rSig <- true
	}(mChan, file)

	// Goroutine 3: close mChan once all workers finish
	go func(rSig chan bool) {
		<-rSig
		close(mChan)
	}(rSig)

	// Main thread: drain mChan and aggregate results
	finalMeasure := make(map[string]*model.MeasurementInt, 512)
	for localMeasurement := range mChan {
		for city, newMeasure := range localMeasurement {
			measurement, exists := finalMeasure[city]
			if !exists {
				measurement = newMeasure
				finalMeasure[city] = measurement
				continue
			}
			measurement.Temps += newMeasure.Temps
			measurement.Count += newMeasure.Count
			measurement.Max = max(measurement.Max, newMeasure.Max)
			measurement.Min = min(measurement.Min, newMeasure.Min)
		}
	}
	return finalMeasure
}`;

export const sampleData = `$ head -5 measurements.txt
Batumi;17.4
Rabat;28.6
Rangpur;23.5
Jakarta;33.4
Tamale;28.3
`

export const p4Pprof = `(pprof) list Compute
ROUTINE ======================== github.com/throwea/1brc-go/pkg/preprocessor.(*P4).Compute in /Users/elianahmar/Development/1brc-personal/pkg/preprocessor/p4.go
      60ms    106.22s (flat, cum) 98.66% of Total
         .          .     35:func (p4 *P4) Compute() map[string]*model.Measurement {
         .          .     36:   // Brute force this. Read line by line and update a table
         .          .     37:   file := utils.PanicE(os.Open(p4.Path))
         .          .     38:   defer file.Close()
         .          .     39:   fileScanner := bufio.NewScanner(file)
         .          .     40:   delim := []byte{';'}
         .          .     41:   measurements := make(map[string]*model.Measurement, 512) 
      10ms    105.24s     42:   for fileScanner.Scan() {
         .          .     43:           line := fileScanner.Bytes()
         .          .     44:           // process the line itself
         .          .     45:           city, num, found := bytes.Cut(line, delim)
         .      260ms     46:           cityName := string(city)
         .          .     47:           utils.PanicIf(!found, "bytes not found?", nil)
         .      210ms     48:           temp := utils.PanicE(strconv.ParseFloat(string(num), 64))
         .      150ms     49:           if _, exists := measurements[cityName]; !exists {
         .          .     50:                   measurements[cityName] = &model.Measurement{City: cityName}
         .          .     51:           }
      20ms       70ms     52:           measurements[cityName].Temps += temp
         .       70ms     53:           measurements[cityName].Count += 1
      30ms      130ms     54:           measurements[cityName].Max = math.Max(measurements[cityName].Max, temp)
         .       90ms     55:           measurements[cityName].Min = math.Min(measurements[cityName].Min, temp)
         .          .     56:   }
         .          .     57:   return measurements
         .          .     58:}
         .          .     59:
         .          .     60:// func (p4 *P4) Compute() map[string]*model.Measurement {
(pprof)
`

export const singlePassDigit = `num = -12.4
line[0] = '-', continue
line[1] = '1', temp = 1 * 10 + int('1' - '0') => 11
line[2] = '2', temp = 11 * 10 + int('2' - '0') => 112`

