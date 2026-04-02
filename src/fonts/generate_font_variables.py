import pandas as pd

# 读取CSV文件
df = pd.read_csv('fonts_data.csv')

# 过滤空行
df = df.dropna()

# 生成SCSS变量
scss_variables = "/* 字体文件路径变量 */\n\n"

for index, row in df.iterrows():
    font_family = row['font-family']
    src = row['src']
    
    # 跳过空的font-family
    if pd.isna(font_family) or font_family.strip() == '':
        continue
    
    # 生成变量名，将空格和特殊字符替换为下划线
    var_name = font_family.replace(' ', '_').replace('-', '_')
    scss_variables += f"${var_name}: {src};\n"

# 保存到SCSS文件
with open('font_variables.scss', 'w', encoding='utf-8') as f:
    f.write(scss_variables)

print("字体变量已生成到 font_variables.scss")
print(f"共生成 {len(df)} 个字体变量")