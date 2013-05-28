function mapRange(num, min, max, new_min, new_max) {
	
	if (max - min != 0) {
		
		return (num - min) / (max - min) * (new_max - new_min) + new_min;
		
	} else {
		
		return num;
	}
}