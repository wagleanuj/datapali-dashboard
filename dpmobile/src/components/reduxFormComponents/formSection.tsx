import { FormSection } from "redux-form"

type FormSectionProps = {
    name: string;
}

class FormSection_ extends React.Component<FormSectionProps, {}>{
   
    renderFields = () => {
        return <></>
    }

    render() {
        return <FormSection
            name={this.props.name}
            component={this.renderFields}
        />
    }
}
