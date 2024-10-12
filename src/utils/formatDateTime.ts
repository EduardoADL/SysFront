export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "Data inválida";
    }
  
    return new Intl.DateTimeFormat("pt-BR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };