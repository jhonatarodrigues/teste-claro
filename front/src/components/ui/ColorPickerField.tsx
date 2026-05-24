import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

import { Button } from "./Button";

const suggestedColors = [
  "#E7FF2F",
  "#8BFF3D",
  "#22D3EE",
  "#00B37E",
  "#F97316",
  "#EF4444",
  "#A855F7",
  "#F472B6",
];

type ColorPickerFieldProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export function ColorPickerField({
  label = "Cor do time",
  value,
  onChange,
  error,
}: ColorPickerFieldProps) {
  const [visible, setVisible] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const pickerModule = visible
    ? (require("reanimated-color-picker") as typeof import("reanimated-color-picker"))
    : null;
  const Picker = pickerModule?.default;
  const Preview = pickerModule?.Preview;
  const Panel1 = pickerModule?.Panel1;
  const HueSlider = pickerModule?.HueSlider;
  const InputWidget = pickerModule?.InputWidget;
  const Swatches = pickerModule?.Swatches;

  const openPicker = () => {
    setDraftValue(value);
    setVisible(true);
  };

  return (
    <View className="gap-2">
      <Text className="text-sm text-app-muted">{label}</Text>
      <Pressable
        onPress={openPicker}
        className="rounded-xl bg-app-input px-4 py-4"
      >
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white">{value.toUpperCase()}</Text>
            <Text className="mt-1 text-xs text-[#7A7A86]">
              Toque para abrir o seletor de cor
            </Text>
          </View>
          <View
            className="h-10 w-10 rounded-full border border-white/10"
            style={{ backgroundColor: value }}
          />
        </View>
      </Pressable>

      {error ? <Text className="text-xs text-app-danger">{error}</Text> : null}

      {visible ? (
        <Modal
          visible
          transparent
          animationType="slide"
          onRequestClose={() => setVisible(false)}
        >
          <View className="flex-1 justify-end bg-black/60">
            <View className="rounded-t-[28px] bg-app-surface px-5 pb-8 pt-5">
              <View className="items-center">
                <Text className="mt-4 text-xl font-semibold text-white">
                  Escolha a cor do time
                </Text>
                <Text className="mt-1 text-sm text-app-muted">
                  Ajuste livremente e confirme quando gostar do resultado
                </Text>
              </View>

              <View className="mt-6 rounded-2xl bg-app-bg px-4 py-5">
                {Picker &&
                Preview &&
                Panel1 &&
                HueSlider &&
                InputWidget &&
                Swatches ? (
                  <Picker
                    value={draftValue}
                    onCompleteJS={({ hex }) => setDraftValue(hex.toUpperCase())}
                    style={{ width: "100%" }}
                    thumbSize={24}
                    boundedThumb
                  >
                    <Preview
                      colorFormat="hex"
                      style={{ borderRadius: 16, marginBottom: 16 }}
                      textStyle={{
                        color: "#FFFFFF",
                        fontSize: 16,
                        fontWeight: "600",
                      }}
                    />
                    <Panel1 style={{ borderRadius: 16, marginBottom: 16 }} />
                    <HueSlider
                      style={{ borderRadius: 999, marginBottom: 16 }}
                    />
                    <InputWidget
                      defaultFormat="HEX"
                      formats={["HEX"]}
                      disableAlphaChannel
                      iconColor="#00B37E"
                      containerStyle={{ marginBottom: 16 }}
                      inputProps={{
                        placeholderTextColor: "#63636f",
                      }}
                      inputStyle={{ color: "#FFFFFF" }}
                      inputTitleStyle={{ color: "#8D8D99" }}
                    />
                    <Swatches
                      colors={suggestedColors}
                      swatchStyle={{ marginHorizontal: 6, marginBottom: 12 }}
                      style={{ justifyContent: "center" }}
                    />
                  </Picker>
                ) : null}
              </View>

              <View className="mt-5 gap-3">
                <Button
                  title="Aplicar cor"
                  onPress={() => {
                    onChange(draftValue);
                    setVisible(false);
                  }}
                />
                <Button
                  title="Cancelar"
                  variant="ghost"
                  onPress={() => setVisible(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
