import axios from 'axios';

const DishSearcher = async () => {
  const {data} = await axios.get('https://themealdb.com/api/json/v1/1/random.php');
  const {idMeal, strMeal, strMealThumb} = data.meals[0];

  return {
    id: idMeal,
    image: strMealThumb,
    name: strMeal,
  }

}

export default DishSearcher;