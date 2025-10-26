
export interface JavaConcept {
  id: 'classes' | 'inheritance' | 'exceptionHandling' | 'multiThreading' | 'fileIO' | 'jdbc';
  label: string;
}

export interface GeneratedFile {
  fileName: string;
  code: string;
}
